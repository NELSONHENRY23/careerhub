import { useState, useEffect } from 'react';
import { api } from '../services/api';

const useJob = (id) => {
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Job not found.');
      }
    };

    if (id) fetchJob();
  }, [id]);

  return { job, error };
};

export default useJob;
