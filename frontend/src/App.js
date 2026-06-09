import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostJob from './pages/PostJob';
import JobDetails from './pages/JobDetails';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
    </Routes>
  );
}

export default App;
