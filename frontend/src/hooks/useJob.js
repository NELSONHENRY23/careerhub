import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { api } from "../services/api";

const useJob = () => {
    const [job, setJob] = useState(null);
    const [error, setError] = useState("");
    const {id} = useParams();
    
    useEffect(() => {
        // Fetch job details from the backend api
        const fetchJob = async() => {
        try {

          const res = api.get("/api/jobs/${id");
          setJob(res.data);
          
        } catch (error) {
          console.error(error);
          setError("Job not found.");
        } 
      }

      fetchJob()
    }, [id])

    if(!job) return <p>Job not found</p>

  return {
    job, 
    error
  }
}

export default useJob