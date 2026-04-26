import { Router } from 'express';
import mongoose from 'mongoose';
import { Reply } from '../models/Reply.js';
import { Post } from '../models/Post.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

// POST /api/posts/:postId/replies
router.post('/posts/:postId/replies', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.postId)) {
      throw new ApiError(400, 'invalid_id', 'Invalid post id');
    }
    const post = await Post.findById(req.params.postId);
    if (!post) throw new ApiError(404, 'post_not_found', 'Post not found');
    const { body } = req.body || {};
    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      throw new ApiError(400, 'missing_fields', 'body is required');
    }
    const reply = await Reply.create({
      postId: post._id,
      authorId: req.user.userId,
      body: body.trim().slice(0, 5000),
    });
    await Post.updateOne({ _id: post._id }, { $inc: { replyCount: 1 } });
    res.status(201).json({
      id: reply._id.toString(),
      body: reply.body,
      createdAt: reply.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/replies/:id
router.delete('/replies/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'invalid_id', 'Invalid reply id');
    }
    const reply = await Reply.findById(req.params.id);
    if (!reply) throw new ApiError(404, 'reply_not_found', 'Reply not found');
    if (reply.authorId.toString() !== req.user.userId) {
      throw new ApiError(403, 'forbidden', 'You can only delete your own replies');
    }
    await reply.deleteOne();
    await Post.updateOne({ _id: reply.postId }, { $inc: { replyCount: -1 } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
