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
        setJobs(res.data);
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
