/**
 * ============================================================================
 *  Feature C — Likes & Profile
 *  Owner: Donovan
 *  File:  server/src/routes/likes.js
 *    1. POST   /api/posts/:id/like     - current user likes a post
 *    2. DELETE /api/posts/:id/like     - current user unlikes a post
 *
 *  keep Post.likeCount in sync:
 *    Each like creation increments Post.likeCount by 1.
 *    Each like deletion decrements Post.likeCount by 1.
 *    Use $inc, never compute from scratch since multiple users may like at once.
 *
 *    If a user "likes again", catch err.code === 11000 and return the current
 *    likeCount with `alreadyLiked: true` --> do NOT increment again.
 *
 *  Both endpoints respond with: { likeCount: <fresh value from DB> }
 * ============================================================================
 */

import { Router } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { Like } from '../models/Like.js';
import { Post } from '../models/Post.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

// ----------------------------------------------------------------------------
// 1) POST /api/posts/:id/like
// ----------------------------------------------------------------------------
router.post('/posts/:id/like', requireAuth, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) throw 400

    const post = await Post.findById(req.params.id)

    if (!post) throw 404
    try {
      await Like.create({ userId: req.user.userId, postId: post._id })
      await Post.updateOne({ _id: post._id }, { $inc: { likeCount: 1 } })
    } catch (err) {
      if (err.code === 11000) {
        const fresh = await Post.findById(post._id)
        return res.json({ likeCount: fresh.likeCount, alreadyLiked: true })
      }
      throw err
    }
    const fresh = await Post.findById(post._id)
    res.json({ likeCount: fresh.likeCount })
    //    res.status(501).json({ error: 'not implemented' });
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------
// 2) DELETE /api/posts/:id/like
// ----------------------------------------------------------------------------
router.delete('/posts/:id/like', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'invalid_id', 'Invalid post id');
    }
    const post = await Post.findById(req.params.id)
    if (!post) throw new ApiError(404, 'post_not_found', 'Post not found');
    const result = await Like.deleteOne({ userId: req.user.userId, postId: req.params.id })
    if (result.deletedCount > 0) {
      await Post.updateOne({ _id: req.params.id }, { $inc: { likeCount: -1 } })
    }
    const fresh = await Post.findById(req.params.id)
    res.json({ likeCount: fresh?.likeCount ?? 0 })
  } catch (err) {
    next(err);
  }
});

export default router;
