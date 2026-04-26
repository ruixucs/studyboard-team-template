/**
 * ============================================================================
 *  Feature B — Posts & Replies
 *  Owner: Ray
 *  File:  server/src/routes/replies.js
 *
 *  You need to implement 2 endpoints:
 *    1. POST   /api/posts/:postId/replies   - reply to a post
 *    2. DELETE /api/replies/:id             - delete your own reply
 *
 *  IMPORTANT: every time you add or remove a reply, you MUST update
 *  Post.replyCount via $inc so the list view stays in sync.
 * ============================================================================
 */

import { Router } from 'express';
import mongoose from 'mongoose';
import { Reply } from '../models/Reply.js';
import { Post } from '../models/Post.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

// ----------------------------------------------------------------------------
// 1) POST /api/posts/:postId/replies   body: { body }
// ----------------------------------------------------------------------------
//  Pseudocode:
//    if (!isValidObjectId(postId)) throw 400
//    const post = await Post.findById(postId)
//    if (!post) throw 404
//    if (!body || body.trim().length === 0) throw ApiError(400, 'missing_fields', ...)
//    const reply = await Reply.create({
//      postId: post._id,
//      authorId: req.user.userId,
//      body: body.trim().slice(0, 5000),
//    })
//    await Post.updateOne({ _id: post._id }, { $inc: { replyCount: 1 } })  // <-- DO NOT FORGET
//    res.status(201).json({
//      id: reply._id.toString(),
//      body: reply.body,
//      createdAt: reply.createdAt,
//    })
router.post('/posts/:postId/replies', requireAuth, async (req, res, next) => {
  try {
    // TODO(Ray)
    res.status(501).json({ error: 'not implemented' });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------
// 2) DELETE /api/replies/:id
// ----------------------------------------------------------------------------
//  Pseudocode:
//    if (!isValidObjectId(id)) throw 400
//    const reply = await Reply.findById(id)
//    if (!reply) throw 404
//    if (reply.authorId.toString() !== req.user.userId) throw 403
//    await reply.deleteOne()
//    await Post.updateOne({ _id: reply.postId }, { $inc: { replyCount: -1 } })  // decrement
//    res.json({ ok: true })
router.delete('/replies/:id', requireAuth, async (req, res, next) => {
  try {
    // TODO(Ray)
    res.status(501).json({ error: 'not implemented' });
  } catch (err) {
    next(err);
  }
});

export default router;
