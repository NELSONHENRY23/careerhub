import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();

const normalizeOrigin = (origin) => origin.replace(/\/$/, '');

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5137',
]
  .flat()
  .filter(Boolean)
  .map((origin) => normalizeOrigin(origin));

const isAllowedOrigin = (origin) => {
  const cleanedOrigin = normalizeOrigin(origin);

  return allowedOrigins.includes(cleanedOrigin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      console.log('Blocked by CORS:', origin);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JunubHire API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resumes', resumeRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;
