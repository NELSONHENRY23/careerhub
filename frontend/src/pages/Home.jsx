import { Link, useNavigate } from 'react-router-dom';
import useJobs from '../hooks/useJobs';
import useAuth from '../hooks/useAuth';

function Home() {
  const { jobs, error } = useJobs();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (error) return <p>{error}</p>;
  if (!jobs) return <p>Loading...</p>;

  return (
    <div >
      <h1 >Career Hub</h1>
      <div>
        {isAdmin && <Link to="/post-job">Post Job</Link>}
        <button
          type="button"
          onClick={handleLogout}
          style={{ marginLeft: '1rem' }}
        >
          Logout
        </button>
      </div>

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
