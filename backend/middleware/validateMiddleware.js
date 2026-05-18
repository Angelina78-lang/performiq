/**
 * Lightweight custom validation middleware (no external library).
 * Each validator returns an Express middleware function.
 */

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(String(value || ''));

/**
 * Validates the body for creating an employee.
 */
export const validateEmployee = (req, res, next) => {
  const errors = [];
  const { name, email, department, skills, performanceScore, experience } = req.body;

  if (!name || String(name).trim().length < 3) {
    errors.push('Name is required and must be at least 3 characters');
  }
  if (!email || !isEmail(email)) {
    errors.push('A valid email is required');
  }
  if (!department || String(department).trim() === '') {
    errors.push('Department is required');
  }
  if (skills !== undefined && !Array.isArray(skills)) {
    errors.push('Skills must be an array');
  }
  if (
    performanceScore === undefined ||
    performanceScore === null ||
    performanceScore === '' ||
    isNaN(Number(performanceScore))
  ) {
    errors.push('Performance score is required and must be numeric');
  } else if (Number(performanceScore) < 0 || Number(performanceScore) > 100) {
    errors.push('Performance score must be between 0 and 100');
  }
  if (
    experience === undefined ||
    experience === null ||
    experience === '' ||
    isNaN(Number(experience))
  ) {
    errors.push('Experience is required and must be numeric');
  } else if (Number(experience) < 0) {
    errors.push('Experience cannot be negative');
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(', ')));
  }
  next();
};

/**
 * Validates the body for updating an employee (all fields optional,
 * but if present they must be valid).
 */
export const validateEmployeeUpdate = (req, res, next) => {
  const errors = [];
  const { name, email, department, skills, performanceScore, experience } = req.body;

  if (name !== undefined && String(name).trim().length < 3) {
    errors.push('Name must be at least 3 characters');
  }
  if (email !== undefined && !isEmail(email)) {
    errors.push('A valid email is required');
  }
  if (department !== undefined && String(department).trim() === '') {
    errors.push('Department cannot be empty');
  }
  if (skills !== undefined && !Array.isArray(skills)) {
    errors.push('Skills must be an array');
  }
  if (performanceScore !== undefined) {
    if (isNaN(Number(performanceScore))) {
      errors.push('Performance score must be numeric');
    } else if (Number(performanceScore) < 0 || Number(performanceScore) > 100) {
      errors.push('Performance score must be between 0 and 100');
    }
  }
  if (experience !== undefined) {
    if (isNaN(Number(experience))) {
      errors.push('Experience must be numeric');
    } else if (Number(experience) < 0) {
      errors.push('Experience cannot be negative');
    }
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(', ')));
  }
  next();
};

/**
 * Validates the score update body for PATCH /:id/score.
 */
export const validateScore = (req, res, next) => {
  const { performanceScore } = req.body;
  if (
    performanceScore === undefined ||
    performanceScore === null ||
    performanceScore === '' ||
    isNaN(Number(performanceScore))
  ) {
    res.status(400);
    return next(new Error('Performance score is required and must be numeric'));
  }
  if (Number(performanceScore) < 0 || Number(performanceScore) > 100) {
    res.status(400);
    return next(new Error('Performance score must be between 0 and 100'));
  }
  next();
};

/**
 * Validates signup body.
 */
export const validateSignup = (req, res, next) => {
  const errors = [];
  const { name, email, password } = req.body;

  if (!name || String(name).trim().length < 3) {
    errors.push('Name is required and must be at least 3 characters');
  }
  if (!email || !isEmail(email)) {
    errors.push('A valid email is required');
  }
  if (!password || String(password).length < 6) {
    errors.push('Password is required and must be at least 6 characters');
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(', ')));
  }
  next();
};

/**
 * Validates login body.
 */
export const validateLogin = (req, res, next) => {
  const errors = [];
  const { email, password } = req.body;

  if (!email || !isEmail(email)) {
    errors.push('A valid email is required');
  }
  if (!password || String(password).length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(', ')));
  }
  next();
};
