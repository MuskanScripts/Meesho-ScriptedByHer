const logger = require('../utils/logger');
const config = require('../config');

/**
 * Middleware for logging all incoming requests
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  
  // Log request details
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    body: config.isDevelopment ? req.body : '[REDACTED]'
  });
  
  // Log response details when request completes
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}

/**
 * Middleware for handling 404 errors
 */
function notFoundHandler(req, res, next) {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `The requested resource at ${req.originalUrl} was not found`
  });
}

/**
 * Middleware for handling all errors
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error('Application error:', {
    error: err.message,
    stack: config.isDevelopment ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Send error response
  res.status(statusCode).json({
    error: err.name || 'Error',
    message: config.isDevelopment ? err.message : 'An unexpected error occurred',
    ...(config.isDevelopment && { stack: err.stack })
  });
}

/**
 * Create a custom error with status code
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  requestLogger,
  notFoundHandler,
  errorHandler,
  AppError
};