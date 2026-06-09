import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch job listings from the backend api
    fetch('http://localhost:5000/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  return (
    <div>
      <h1>Career Hub</h1>

      <p>
        {jobs.map((job) => (
          <div key={job.id}>
            <h3>{job.title}</h3>
            <p> {job.company}</p>
            <Link to={`/jobs/${job.id}`}>View Details</Link>
          </div>
        ))}
      </p>
    </div>
  );
}

export default Home;
