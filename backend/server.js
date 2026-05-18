import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { notFoundMiddleware } from './middleware/notFoundMiddleware.js';

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(express.json());

// CORS — allow configured origins (comma-separated CLIENT_URL)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// ===== Health check =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Employee Performance Analytics API is running',
    version: '1.0.0',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString() });
});

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/ai', aiRoutes);

// ===== Error handling =====
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
