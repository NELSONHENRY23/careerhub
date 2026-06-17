import { useState, useEffect } from 'react';
import { api } from '../services/api';

const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch job listings from the backend api
    const fetchJobs = async () => {
      try {
        const res = await api.get('/api/jobs');
        const jobList = res.data?.data;
        setJobs(Array.isArray(jobList) ? jobList : []);
      } catch (error) {
        console.error(error);
        setError('Failed to load Jobs.');
      }
    };

    fetchJobs();
  }, []);

  return {
    jobs,
    error,
  };
};

export default useJobs;
