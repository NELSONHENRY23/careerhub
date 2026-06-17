import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import useJobs from '../hooks/useJobs';

const Dashboard = () => {
  const { jobs, error } = useJobs();

  const safeJobs = Array.isArray(jobs) ? jobs : [];

  const popularJobs = useMemo(
    () => safeJobs.slice(0, 4),
    [safeJobs]
  );

  const totalJobs = useMemo(
    () => safeJobs.length,
    [safeJobs]
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[40px] bg-white p-10 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                Dashboard
              </p>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">
                Welcome back to your career hub.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Track the latest openings, manage applications, and see the hiring pulse all from one place.
              </p>
            </div>
            <div className="rounded-[32px] bg-blue-600 px-6 py-5 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.24em] text-blue-100">Active jobs</p>
              <p className="mt-4 text-4xl font-semibold">{totalJobs}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">Saved searches</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">3</p>
              <p className="mt-3 text-sm text-slate-600">Quick access to your most relevant roles.</p>
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">Applications</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">12</p>
              <p className="mt-3 text-sm text-slate-600">Track active applications and next steps.</p>
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">Top categories</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">5</p>
              <p className="mt-3 text-sm text-slate-600">Browse high-demand roles from top fields.</p>
            </div>
          </div>
        </div>

        <section className="mt-10 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recent job highlights</h2>
              <p className="mt-2 text-sm text-slate-600">Quick preview of the newest listings available now.</p>
            </div>
            <Link to="/jobs" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              View all jobs
            </Link>
          </div>

          {error ? (
            <div className="rounded-[32px] bg-white p-8 shadow-sm text-red-600">{error}</div>
          ) : popularJobs.length === 0 ? (
            <div className="rounded-[32px] bg-white p-8 text-slate-600 shadow-sm">
              No jobs available yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {popularJobs.map((job) => (
                <Link to={`/jobs/${job._id}`} key={job._id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                 
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{job.company}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                      {job.location || 'Remote'}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {job.description ? `${job.description.slice(0, 120)}...` : 'Strong opportunity with a high-growth employer.'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
