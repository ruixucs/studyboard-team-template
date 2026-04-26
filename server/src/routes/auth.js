import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { isMcgillEmail, validatePassword } from '../lib/validate.js';
import { signToken } from '../lib/jwt.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body || {};
    if (!isMcgillEmail(email)) {
      throw new ApiError(400, 'invalid_email', 'Email must be @mcgill.ca or @mail.mcgill.ca');
    }
    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) throw new ApiError(400, 'weak_password', pwCheck.reason);
    if (!displayName || typeof displayName !== 'string' || displayName.trim().length < 1) {
      throw new ApiError(400, 'invalid_name', 'Display name is required');
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw new ApiError(409, 'email_taken', 'Email is already registered');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      displayName: displayName.trim(),
    });

    const token = signToken({ userId: user._id.toString(), email: user.email });
    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw new ApiError(400, 'missing_fields', 'Email and password required');

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) throw new ApiError(401, 'invalid_credentials', 'Invalid email or password');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new ApiError(401, 'invalid_credentials', 'Invalid email or password');

    const token = signToken({ userId: user._id.toString(), email: user.email });
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) throw new ApiError(404, 'user_not_found', 'User not found');
    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
});

export default router;
