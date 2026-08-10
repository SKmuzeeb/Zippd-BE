// Centralized error handler — must be the last app.use(). Controllers/services throw
// plain Errors (optionally with a `.status`); asyncHandler forwards them here.
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = status >= 500 ? 'Internal server error' : err.message || 'Request failed';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
}
