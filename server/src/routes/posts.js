/**
 * ============================================================================
 *  Feature B — Posts & Replies
 *  Owner: Ray
 *  File:  server/src/routes/posts.js
 *
 *  You need to implement 5 endpoints:
 *    1. GET    /api/courses/:courseId/posts?sort=latest|hot   - list posts in a course
 *    2. GET    /api/posts/:id                                  - single post + inline replies
 *    3. POST   /api/courses/:courseId/posts                    - create a new post
 *    4. PATCH  /api/posts/:id                                  - edit (author only)
 *    5. DELETE /api/posts/:id                                  - delete (cascade replies + likes)
 *
 *  Response data contract (the frontend depends on this):
 *    Post = {
 *      id, courseId, title, body,
 *      likeCount, replyCount,
 *      createdAt, updatedAt,
 *      author: { id, displayName },
 *      likedByMe: boolean        // whether the CURRENT user has liked this post
 *    }
 *    PostDetail = Post & { replies: Reply[] }
 *    Reply = { id, body, createdAt, author: { id, displayName } }
 *
 *  Helper:
 *    `hydrate(posts, currentUserId)` — given raw Post documents, returns the
 *    enriched shape above (with author + likedByMe). You write this; pseudocode below.
 * ============================================================================
 */

import { Router } from 'express';
import mongoose from 'mongoose';
import { Post } from '../models/Post.js';
import { Reply } from '../models/Reply.js';
import { Like } from '../models/Like.js';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

// ----------------------------------------------------------------------------
// Helper: hydrate(posts, currentUserId)
// ----------------------------------------------------------------------------
//  Pseudocode:
//    if (posts.length === 0) return []
//    const authorIds = unique post.authorId values
//    const authors = await User.find({ _id: { $in: authorIds } }).lean()
//    const byId = new Map(authors.map(a => [a._id.toString(), a]))
//
//    let likedSet = new Set()
//    if (currentUserId) {
//      const likes = await Like.find({
//        userId: currentUserId,
//        postId:  { $in: posts.map(p => p._id) },
//      }).lean()
//      likedSet = new Set(likes.map(l => l.postId.toString()))
//    }
//
//    return posts.map(p => ({
//      id: p._id.toString(),
//      courseId: p.courseId.toString(),
//      title: p.title,
//      body: p.body,
//      likeCount: p.likeCount,
//      replyCount: p.replyCount,
//      createdAt: p.createdAt,
//      updatedAt: p.updatedAt,
//      author: byId.has(p.authorId.toString())
//        ? { id: byId.get(...)._id.toString(), displayName: byId.get(...).displayName }
//        : { id: null, displayName: '[deleted]' },
//      likedByMe: likedSet.has(p._id.toString()),
//    }))
async function hydrate(posts, currentUserId) {
  // TODO(Ray): implement as described
  return [];
}

// ----------------------------------------------------------------------------
// 1) GET /api/courses/:courseId/posts?sort=latest|hot
// ----------------------------------------------------------------------------
//  Pseudocode:
//    if (!isValidObjectId(courseId)) throw ApiError(400, 'invalid_id', ...)
//    const sort = req.query.sort === 'hot'
//      ? { likeCount: -1, createdAt: -1 }
//      : { createdAt: -1 }
//    const posts = await Post.find({ courseId }).sort(sort).limit(100).lean()
//    res.json(await hydrate(posts, req.user.userId))
router.get('/courses/:courseId/posts', requireAuth, async (req, res, next) => {
  try {
    // TODO(Ray)
    res.json([]);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------
// 2) GET /api/posts/:id  — single post + inline replies
// ----------------------------------------------------------------------------
//  Pseudocode:
//    if (!isValidObjectId(id)) throw 400
//    const post = await Post.findById(id).lean()
//    if (!post) throw 404
//    const [hydrated] = await hydrate([post], req.user.userId)
//
//    // attach replies (with author):
//    const replies = await Reply.find({ postId: post._id }).sort({ createdAt: 1 }).lean()
//    const replyAuthorIds = unique replies.authorId
//    const replyAuthors = await User.find({ _id: { $in: replyAuthorIds } }).lean()
//    hydrated.replies = replies.map(r => ({
//      id: r._id.toString(),
//      body: r.body,
//      createdAt: r.createdAt,
//      author: { id: ..., displayName: ... } || { id: null, displayName: '[deleted]' },
//    }))
//    res.json(hydrated)
router.get('/posts/:id', requireAuth, async (req, res, next) => {
  try {
    // TODO(Ray)
    res.status(501).json({ error: 'not implemented' });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------
// 3) POST /api/courses/:courseId/posts   body: { title, body }
// ----------------------------------------------------------------------------
//  Pseudocode:
//    if (!isValidObjectId(courseId)) throw 400
//    const course = await Course.findById(courseId)
//    if (!course) throw 404
//    if (!title || !body) throw ApiError(400, 'missing_fields', ...)
//    const post = await Post.create({
//      courseId, authorId: req.user.userId,
//      title: String(title).trim().slice(0, 200),
//      body:  String(body).slice(0, 10000),
//    })
//    const [hydrated] = await hydrate([post.toObject()], req.user.userId)
//    res.status(201).json(hydrated)
router.post('/courses/:courseId/posts', requireAuth, async (req, res, next) => {
  try {
    // TODO(Ray)
    res.status(501).json({ error: 'not implemented' });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------
// 4) PATCH /api/posts/:id   body: { title?, body? }
// ----------------------------------------------------------------------------
//  Pseudocode:
//    if (!isValidObjectId(id)) throw 400
//    const post = await Post.findById(id)
//    if (!post) throw 404
//    if (post.authorId.toString() !== req.user.userId) throw ApiError(403, 'forbidden', ...)
//    if (title !== undefined) post.title = String(title).trim().slice(0, 200)
//    if (body  !== undefined) post.body  = String(body).slice(0, 10000)
//    await post.save()
//    const [hydrated] = await hydrate([post.toObject()], req.user.userId)
//    res.json(hydrated)
router.patch('/posts/:id', requireAuth, async (req, res, next) => {
  try {
    // TODO(Ray)
    res.status(501).json({ error: 'not implemented' });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------
// 5) DELETE /api/posts/:id  — must cascade Replies + Likes
// ----------------------------------------------------------------------------
//  Pseudocode:
//    Validate id; load post; if (!post) 404; if (not author) 403
//    await Promise.all([
//      Reply.deleteMany({ postId: post._id }),
//      Like.deleteMany({ postId: post._id }),
//      post.deleteOne(),
//    ])
//    res.json({ ok: true })
router.delete('/posts/:id', requireAuth, async (req, res, next) => {
  try {
    // TODO(Ray)
    res.status(501).json({ error: 'not implemented' });
  } catch (err) {
    next(err);
  }
});

export default router;
