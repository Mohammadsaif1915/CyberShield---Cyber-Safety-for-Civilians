/**
 * Global error-handling middleware.
 * Catches all errors thrown in route handlers / next(err).
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('❌ Error:', err.stack || err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern).join(', ');
    return res.status(409).json({
      success: false,
      error: `Duplicate value for: ${field}`,
    });
  }

  // Mongoose cast error (bad ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid value for ${err.path}: ${err.value}`,
    });
  }

  // Generic fallback
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
