import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) {
      res.status(400);
      throw new Error('A user with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'hr' ? 'hr' : 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate a user and return a JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user || !(await User.matchPassword(user, password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
