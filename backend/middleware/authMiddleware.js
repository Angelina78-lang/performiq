import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protects routes by verifying the Bearer JWT.
 * Attaches the authenticated user (without password) to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Not authorized — no token provided');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      res.status(401);
      throw new Error('Not authorized — invalid or expired token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('Not authorized — user no longer exists');
    }

    // Remove password from user object
    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
