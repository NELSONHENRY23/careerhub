import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust the base URL as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
