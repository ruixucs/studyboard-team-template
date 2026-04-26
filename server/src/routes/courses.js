/**
 * ============================================================================
 *  Feature A — Courses & Enrollment
 *  Owner: Danny
 *  File:  server/src/routes/courses.js
 *
 *  You need to implement 4 endpoints:
 *    1. GET    /api/courses?search=xxx       - list courses (filter optional);
 *                                              if a logged-in user, mark `enrolled` on each
 *    2. POST   /api/courses                  - logged-in user adds a new course
 *    3. POST   /api/courses/:id/enroll       - current user enrolls in a course
 *    4. DELETE /api/courses/:id/enroll       - current user un-enrolls
 *
 *  Response data contract (the frontend depends on this — keep field names exact):
 *    Course = { id, code, name, faculty, enrolled }
 *
 *  Helpers available to you:
 *    - requireAuth middleware: once attached, req.user.userId is set
 *    - ApiError(status, code, message): throw it; errorHandler turns it into JSON
 *    - mongoose.isValidObjectId(x): validate the :id param
 *    - On a duplicate-unique-index error, err.code === 11000
 * ============================================================================
 */

import { Router } from 'express';
import mongoose from 'mongoose';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

// ----------------------------------------------------------------------------
// 1) GET /api/courses?search=xxx
// ----------------------------------------------------------------------------
//  - Auth is OPTIONAL (anyone can browse)
//  - If `search` is provided, do a case-insensitive match on `code` OR `name`
//  - If the request has a Bearer token, decode it and mark each course
//    with `enrolled: true/false` based on the user's Enrollment records
//
//  Pseudocode:
//    1. const q = (req.query.search || '').toString().trim()
//    2. const filter = q
//         ? { $or: [{ code: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }] }
//         : {}
//    3. const courses = await Course.find(filter).sort({ code: 1 }).limit(200).lean()
//    4. let enrolledSet = new Set()
//    5. const m = (req.headers.authorization || '').match(/^Bearer (.+)$/)
//       if (m) {
//         try {
//           const { verifyToken } = await import('../lib/jwt.js')
//           const payload = verifyToken(m[1])
//           const enrollments = await Enrollment.find({ userId: payload.userId }).lean()
//           enrolledSet = new Set(enrollments.map(e => e.courseId.toString()))
//         } catch { /* invalid token => treat as anonymous */ }
//       }
//    6. res.json(courses.map(c => ({
//         id: c._id.toString(), code: c.code, name: c.name, faculty: c.faculty,
//         enrolled: enrolledSet.has(c._id.toString())
//       })))
router.get('/', async (req, res, next) => {
  try {
    // TODO(Danny): implement the logic described above
    res.json([]); // <-- delete this and return real data
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------
// 2) POST /api/courses    body: { code, name, faculty }
// ----------------------------------------------------------------------------
//  - Auth required
//  - Missing field => ApiError(400, 'missing_fields', '...')
//  - Normalize `code` to upper-case + trim
//  - If a course with the same `code` already exists => ApiError(409, 'course_exists', '...')
//  - Set createdBy = req.user.userId
//  - Return 201 with a Course shape (enrolled: false)
//
//  Pseudocode:
//    const { code, name, faculty } = req.body || {}
//    if (!code || !name || !faculty) throw new ApiError(400, 'missing_fields', '...')
//    const normalizedCode = String(code).trim().toUpperCase()
//    if (await Course.findOne({ code: normalizedCode })) throw new ApiError(409, ...)
//    const course = await Course.create({ code: normalizedCode, name: ..., faculty: ..., createdBy: req.user.userId })
//    res.status(201).json({ id, code, name, faculty, enrolled: false })
router.post('/', requireAuth, async (req, res, next) => {
  try {
    // TODO(Danny)
    res.status(501).json({ error: 'not implemented' });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------
// 3) POST /api/courses/:id/enroll
// ----------------------------------------------------------------------------
//  - Auth required
//  - Bad ObjectId => 400; Course not found => 404
//  - If already enrolled (unique index throws 11000), respond { ok: true, alreadyEnrolled: true }
//  - Otherwise create Enrollment, respond { ok: true }
//
//  Pseudocode:
//    if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'invalid_id', ...)
//    const course = await Course.findById(req.params.id)
//    if (!course) throw new ApiError(404, 'course_not_found', ...)
//    try {
//      await Enrollment.create({ userId: req.user.userId, courseId: course._id })
//    } catch (err) {
//      if (err.code === 11000) return res.json({ ok: true, alreadyEnrolled: true })
//      throw err
//    }
//    res.json({ ok: true })
router.post('/:id/enroll', requireAuth, async (req, res, next) => {
  try {
    // TODO(Danny)
    res.status(501).json({ error: 'not implemented' });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------
// 4) DELETE /api/courses/:id/enroll
// ----------------------------------------------------------------------------
//  - Auth required
//  - Bad ObjectId => 400
//  - No need to check the course exists: just deleteOne and return ok
//
//  Pseudocode:
//    if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'invalid_id', ...)
//    await Enrollment.deleteOne({ userId: req.user.userId, courseId: req.params.id })
//    res.json({ ok: true })
router.delete('/:id/enroll', requireAuth, async (req, res, next) => {
  try {
    // TODO(Danny)
    res.status(501).json({ error: 'not implemented' });
  } catch (err) {
    next(err);
  }
});

export default router;
