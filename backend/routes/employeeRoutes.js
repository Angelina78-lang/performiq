import express from 'express';
import {
  createEmployee,
  getEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeScore,
  deleteEmployee,
  getEmployeeStats,
} from '../controllers/employeeController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateEmployee,
  validateEmployeeUpdate,
  validateScore,
} from '../middleware/validateMiddleware.js';

const router = express.Router();

// All employee routes are protected.
router.use(protect);

// Static/sub paths must come BEFORE the dynamic /:id route.
router.get('/search', searchEmployees);
router.get('/stats/summary', getEmployeeStats);

router.route('/').get(getEmployees).post(validateEmployee, createEmployee);

router
  .route('/:id')
  .get(getEmployeeById)
  .put(validateEmployeeUpdate, updateEmployee)
  .delete(deleteEmployee);

router.patch('/:id/score', validateScore, updateEmployeeScore);

export default router;
