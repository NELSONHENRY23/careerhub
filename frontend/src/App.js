import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostJob from './pages/PostJob';
import JobDetails from './pages/JobDetails';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/" element={
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>
      }/>
      <Route path="/jobs/:id" element={
        <ProtectedRoute>
          <JobDetails/>
        </ProtectedRoute>
      }/>
      <Route path="/post-job" element={
        <ProtectedRoute>
          <PostJob/>
        </ProtectedRoute>
      }/>
      
    </Routes>
  );
}

export default App;
