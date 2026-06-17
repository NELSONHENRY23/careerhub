import { Link } from "react-router-dom"
import useJobs from "../hooks/useJobs";

const JobLists = () => {
    const { jobs, error } = useJobs();

    if (error) return <p>{error}</p>;
  
  return (
    <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="mt-2 text-slate-600">{job.company}</p>
              <Link
                to={`/jobs/${job._id}`}
                className="mt-4 inline-block text-indigo-600 hover:text-indigo-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
  )
}

export default JobLists