import { verifyToken } from '../lib/jwt.js';
import { ApiError } from './errorHandler.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) return next(new ApiError(401, 'unauthenticated', 'Missing Bearer token'));

  try {
    const payload = verifyToken(match[1]);
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch {
    next(new ApiError(401, 'invalid_token', 'Invalid or expired token'));
  }
}
