/**
 * Catches requests to undefined routes and forwards a 404 error
 * to the centralized error handler.
 */
export const notFoundMiddleware = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found — ${req.method} ${req.originalUrl}`));
};
