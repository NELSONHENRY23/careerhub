import { Link } from 'react-router-dom';
import useJobs from '../hooks/useJobs';

function Home() {
  const { jobs, error } = useJobs();

  return (
    <div>
      <h1>Career Hub</h1>

      {error && <p>{error}</p>}
      <div>
        {jobs.map((job) => (
          <div key={job._id}>
            <h3>{job.title}</h3>
            <p> {job.company}</p>
            <Link to={`/jobs/${job._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
