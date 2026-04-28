/* Donovan
 */

import { Router } from 'express';
import mongoose from 'mongoose';
import { Like } from '../models/Like.js';
import { Post } from '../models/Post.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

//POST /api/posts/:id/like (like)
router.post('/posts/:id/like', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'invalid_id', 'Invalid post id');
    }

    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'post_not_found', 'Post not found');

    try {
      await Like.create({ userId: req.user.userId, postId: post._id });
      await Post.updateOne({ _id: post._id }, { $inc: { likeCount: 1 } });
    } catch (err) {
      if (err.code === 11000) {
        const fresh = await Post.findById(post._id);
        return res.json({ likeCount: fresh.likeCount, alreadyLiked: true });
      }
      throw err;
    }

    const fresh = await Post.findById(post._id);
    res.json({ likeCount: fresh.likeCount });
  } catch (err) {
    next(err);
  }
});

//DELETE /api/posts/:id/like (unlike)
router.delete('/posts/:id/like', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'invalid_id', 'Invalid post id');
    }

    const result = await Like.deleteOne({ userId: req.user.userId, postId: req.params.id });
    if (result.deletedCount > 0) {
      await Post.updateOne({ _id: req.params.id }, { $inc: { likeCount: -1 } });
    }

    const fresh = await Post.findById(req.params.id);
    res.json({ likeCount: fresh?.likeCount ?? 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
