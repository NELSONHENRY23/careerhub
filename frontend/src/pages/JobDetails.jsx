import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

function JobDetails() {
    const [job, setJob] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        // Fetch job details from the backend api
        fetch(`http://localhost:5000/api/jobs/${id}`)
        .then(res => res.json())
        .then(data => setJob(data));
    }, [id])

    if(!job) return <p>Job not found</p>
  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>{job.salary}</p>
      <p>{job.description}</p>
    </div>
  )
}

export default JobDetails