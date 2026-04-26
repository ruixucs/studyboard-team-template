import { Router } from 'express';
import mongoose from 'mongoose';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { Post } from '../models/Post.js';
import { Reply } from '../models/Reply.js';
import { Like } from '../models/Like.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/errorHandler.js';
import { verifyToken } from '../lib/jwt.js';
import { isAdminEmail } from '../lib/admin.js';
import { lookupCatalog, formatDisplayCode } from '../lib/courseCatalog.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.search || '').toString().trim();
    const filter = q
      ? {
          $or: [{ code: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }, { faculty: new RegExp(q, 'i') }],
        }
      : {};

    const courses = await Course.find(filter).sort({ code: 1 }).limit(200).lean();
    let enrolledSet = new Set();
    let isAdmin = false;

    const m = (req.headers.authorization || '').match(/^Bearer (.+)$/);
    if (m) {
      try {
        const payload = verifyToken(m[1]);
        isAdmin = isAdminEmail(payload.email);
        const enrollments = await Enrollment.find({ userId: payload.userId }).lean();
        enrolledSet = new Set(enrollments.map((e) => e.courseId.toString()));
      } catch {}
    }

    res.json(
      courses.map((c) => ({
        id: c._id.toString(),
        code: c.code,
        name: c.name,
        faculty: c.faculty,
        enrolled: enrolledSet.has(c._id.toString()),
        canDelete: isAdmin,
      }))
    );
  } catch (err) {
    next(err);
  }
});


router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body || {};
    if (!code || !String(code).trim()) {
      throw new ApiError(400, 'missing_fields', 'Course code is required');
    }

    const match = lookupCatalog(code);
    if (!match) {
      throw new ApiError(
        404,
        'not_in_catalog',
        'That course is not in the McGill catalog. Ask an admin to add it manually.'
      );
    }

    const displayCode = formatDisplayCode(match);
    if (await Course.findOne({ code: displayCode })) {
      throw new ApiError(409, 'course_exists', 'This course is already on StudyBoard');
    }

    const course = await Course.create({
      code: displayCode,
      name: match.title,
      faculty: match.faculty,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      id: course._id.toString(),
      code: course.code,
      name: course.name,
      faculty: course.faculty,
      enrolled: false,
    });
  } catch (err) {
    next(err);
  }
});


router.post('/:id/enroll', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, 'invalid_id', 'Invalid course id');
    }

    const course = await Course.findById(id);
    if (!course) {
      throw new ApiError(404, 'course_not_found', 'Course not found');
    }

    try {
      await Enrollment.create({ userId: req.user.userId, courseId: course._id });
    } catch (err) {
      if (err.code === 11000) {
        return res.json({ ok: true, alreadyEnrolled: true });
      }
      throw err;
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});


router.delete('/:id/enroll', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, 'invalid_id', 'Invalid course id');
    }

    await Enrollment.deleteOne({ userId: req.user.userId, courseId: id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new ApiError(403, 'forbidden', 'Only admins can delete courses');
    }

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, 'invalid_id', 'Invalid course id');
    }

    const course = await Course.findById(id).lean();
    if (!course) {
      throw new ApiError(404, 'course_not_found', 'Course not found');
    }

    const posts = await Post.find({ courseId: id }, { _id: 1 }).lean();
    const postIds = posts.map((p) => p._id);

    if (postIds.length > 0) {
      await Promise.all([
        Like.deleteMany({ postId: { $in: postIds } }),
        Reply.deleteMany({ postId: { $in: postIds } }),
      ]);
      await Post.deleteMany({ _id: { $in: postIds } });
    }

    await Promise.all([Enrollment.deleteMany({ courseId: id }), Course.deleteOne({ _id: id })]);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
