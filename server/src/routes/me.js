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
 *
 *  These read across feature boundaries (Enrollment from A, Post from B),
 *  so make sure those models exist BEFORE you call this from the frontend.
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
//  Returns the courses the logged-in user is enrolled in, newest enrollment first.
//
//  Pseudocode:
//    const enrollments = await Enrollment.find({ userId: req.user.userId })
//      .populate('courseId')                  // expand the referenced Course doc
//      .sort({ createdAt: -1 })
//      .lean()
//    const courses = enrollments
//      .filter(e => e.courseId)               // skip if the course was deleted
//      .map(e => ({
//        id:      e.courseId._id.toString(),
//        code:    e.courseId.code,
//        name:    e.courseId.name,
//        faculty: e.courseId.faculty,
//        enrolledAt: e.createdAt,
//      }))
//    res.json(courses)
router.get('/courses', requireAuth, async (req, res, next) => {
  try {
    // TODO(Donovan)
    res.json([]);
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
//
//  Pseudocode:
//    const posts = await Post.find({ authorId: req.user.userId })
//      .sort({ createdAt: -1 })
//      .limit(100)
//      .lean()
//    const totalLikesReceived = posts.reduce((sum, p) => sum + (p.likeCount || 0), 0)
//    res.json({
//      posts: posts.map(p => ({
//        id: p._id.toString(),
//        courseId: p.courseId.toString(),
//        title: p.title,
//        likeCount: p.likeCount,
//        replyCount: p.replyCount,
//        createdAt: p.createdAt,
//      })),
//      totalLikesReceived,
//    })
router.get('/activity', requireAuth, async (req, res, next) => {
  try {
    // TODO(Donovan)
    res.json({ posts: [], totalLikesReceived: 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
