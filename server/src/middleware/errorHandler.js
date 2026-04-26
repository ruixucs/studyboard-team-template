export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: { message: err.message, code: err.code } });
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: { message: err.message, code: 'validation_error' } });
  }

  // Duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ error: { message: 'Duplicate value', code: 'duplicate' } });
  }

  console.error('[unhandled]', err);
  res.status(500).json({ error: { message: 'Internal server error', code: 'internal' } });
}

export function notFound(req, res) {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.path}`, code: 'not_found' } });
}
