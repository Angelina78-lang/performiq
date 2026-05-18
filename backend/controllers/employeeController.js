import Employee from '../models/Employee.js';
import { rankEmployees } from '../utils/rankingUtils.js';

/**
 * @desc    Create a new employee
 * @route   POST /api/employees
 * @access  Private
 */
export const createEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    const employee = await Employee.create({
      name,
      email,
      department,
      skills: Array.isArray(skills) ? skills : [],
      performanceScore,
      experience,
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all employees (supports optional sort & department filter)
 * @route   GET /api/employees?sort=performanceScore&order=desc&department=Development
 * @access  Private
 */
export const getEmployees = async (req, res, next) => {
  try {
    const { sort, order, department } = req.query;

    const employees = await Employee.findAll({
      sort: sort || 'created_at',
      order: order || 'desc',
      department,
    });

    res.json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search/filter employees by department, minScore, skill, name
 * @route   GET /api/employees/search?department=Development&minScore=70&skill=React&name=John
 * @access  Private
 */
export const searchEmployees = async (req, res, next) => {
  try {
    const { department, minScore, skill, name } = req.query;

    const employees = await Employee.search({
      department,
      minScore,
      skill,
      name,
    });

    res.json({
      success: true,
      count: employees.length,
      filters: { department, minScore, skill, name },
      employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single employee by id
 * @route   GET /api/employees/:id
 * @access  Private
 */
export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
    res.json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an employee
 * @route   PUT /api/employees/:id
 * @access  Private
 */
export const updateEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    const updated = await Employee.update(req.params.id, {
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
    });

    if (!updated) {
      res.status(404);
      throw new Error('Employee not found');
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update only an employee's performance score
 * @route   PATCH /api/employees/:id/score
 * @access  Private
 */
export const updateEmployeeScore = async (req, res, next) => {
  try {
    const updated = await Employee.update(req.params.id, {
      performanceScore: req.body.performanceScore,
    });

    if (!updated) {
      res.status(404);
      throw new Error('Employee not found');
    }

    res.json({
      success: true,
      message: 'Performance score updated successfully',
      employee: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an employee
 * @route   DELETE /api/employees/:id
 * @access  Private
 */
export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    await Employee.delete(req.params.id);

    res.json({
      success: true,
      message: 'Employee deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Dashboard analytics summary
 * @route   GET /api/employees/stats/summary
 * @access  Private
 */
export const getEmployeeStats = async (req, res, next) => {
  try {
    const employees = await Employee.findAll_Simple();
    const total = employees.length;

    if (total === 0) {
      return res.json({
        success: true,
        stats: {
          totalEmployees: 0,
          averagePerformance: 0,
          topPerformer: null,
          promotionEligibleCount: 0,
          departmentAverages: [],
          topEmployees: [],
          skillDistribution: [],
        },
      });
    }

    const averagePerformance =
      employees.reduce((sum, e) => sum + e.performance_score, 0) / total;

    const ranked = rankEmployees(employees);
    const topPerformer = ranked[0];

    const promotionEligibleCount = employees.filter(
      (e) => e.performance_score >= 85
    ).length;

    // Department-wise averages
    const deptMap = {};
    employees.forEach((e) => {
      if (!deptMap[e.department]) deptMap[e.department] = { sum: 0, count: 0 };
      deptMap[e.department].sum += e.performance_score;
      deptMap[e.department].count += 1;
    });
    const departmentAverages = Object.entries(deptMap).map(([department, v]) => ({
      department,
      averageScore: Math.round((v.sum / v.count) * 10) / 10,
      count: v.count,
    }));

    // Skill distribution (top skills)
    const skillMap = {};
    employees.forEach((e) => {
      (e.skills || []).forEach((s) => {
        const key = s.trim();
        skillMap[key] = (skillMap[key] || 0) + 1;
      });
    });
    const skillDistribution = Object.entries(skillMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      stats: {
        totalEmployees: total,
        averagePerformance: Math.round(averagePerformance * 10) / 10,
        topPerformer: {
          name: topPerformer.name,
          email: topPerformer.email,
          performanceScore: topPerformer.performance_score,
          department: topPerformer.department,
        },
        promotionEligibleCount,
        departmentAverages,
        topEmployees: ranked.slice(0, 5).map((e) => ({
          name: e.name,
          email: e.email,
          performanceScore: e.performance_score,
          experience: e.experience,
          rankingScore: e.rankingScore,
        })),
        skillDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};
