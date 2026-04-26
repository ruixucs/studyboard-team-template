/**
 * ============================================================================
 *  Feature C — Likes & Profile
 *  Owner: Donovan
 *  File:  server/src/routes/me.js
 *
 *  Aggregate endpoints for the current user, used by Dashboard and Profile pages.
 *
 *    1. GET /api/me/courses     - all courses the user is enrolled in
 *    2. GET /api/me/activity    - the user's posts + total likes received
 * ============================================================================
 */

import { Router } from 'express';
import { Enrollment } from '../models/Enrollment.js';
import { Post } from '../models/Post.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// ----------------------------------------------------------------------------
// 1) GET /api/me/courses
// ----------------------------------------------------------------------------
router.get('/courses', requireAuth, async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.userId })
      .populate('courseId')
      .sort({ createdAt: -1 });
    const courses = enrollments
      .filter(e => e.courseId) //if course deleted, skip
      .map(e => ({
        id:      e.courseId._id.toString(),
        code:    e.courseId.code,
        name:    e.courseId.name,
        faculty: e.courseId.faculty,
        enrolledAt: e.createdAt,
      }));
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------
// 2) GET /api/me/activity
// ----------------------------------------------------------------------------
//  Returns the user's posts (most recent 100) + total likes received across them.
//  Used by the Profile page.
//
//  Response shape:
//    {
//      posts: Array<{ id, courseId, title, likeCount, replyCount, createdAt }>,
//      totalLikesReceived: number
//    }
router.get('/activity', requireAuth, async (req, res, next) => {
  try {
    const posts = await Post.find({ authorId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    const totalLikesReceived = posts.reduce((sum, p) => sum + (p.likeCount || 0), 0);
    res.json({
      posts: posts.map(p => ({
        id: p._id.toString(),
        courseId: p.courseId.toString(),
        title: p.title,
        likeCount: p.likeCount,
        replyCount: p.replyCount,
        createdAt: p.createdAt,
      })),
      totalLikesReceived,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
