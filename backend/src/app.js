import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();

// middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5137',
    credentials: true,
  })
);

app.use(express.json());

// health route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JunubHire API is running',
  });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resumes', resumeRoutes);

// 404 handler must come AFTER routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;