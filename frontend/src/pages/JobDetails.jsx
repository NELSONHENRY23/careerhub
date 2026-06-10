import { useParams } from 'react-router-dom';
import useJob from '../hooks/useJob';

function JobDetails() {
  const { id } = useParams();
  const { job, error } = useJob(id);

  if (error) return <p>{error}</p>;
  if (!job && !error) return <p>Loading...</p>;

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>{job.salary}</p>
      <p>{job.description}</p>
    </div>
  );
}

export default JobDetails;
