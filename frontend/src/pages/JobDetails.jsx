import useJob from "../hooks/useJob"


function JobDetails() {
    const {job, error} = useJob();

  return (
    <div>
      {error && <p>{error}</p>}
      
      <h1>{job.title}</h1>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>{job.salary}</p>
      <p>{job.description}</p>
    </div>
  )
}

export default JobDetails