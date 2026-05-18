import app from '../server.js';
import connectDB from '../config/db.js';

let isConnected = false;

// Serverless function wrapper
export default async (req, res) => {
  // Establish database connection once and reuse it across serverless invocations
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('❌ Database connection failed in serverless function:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed. Please check logs.',
      });
    }
  }

  // Pass control to Express app
  return app(req, res);
};
