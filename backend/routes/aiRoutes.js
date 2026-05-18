import express from 'express';
import { getRecommendation } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// AI routes are protected.
router.post('/recommend', protect, getRecommendation);

export default router;
