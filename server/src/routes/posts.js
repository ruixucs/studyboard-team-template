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

async function hydrate(posts, currentUserId) {
  if (posts.length === 0) return [];
  const authorIds = [...new Set(posts.map((p) => p.authorId.toString()))];
  const authors = await User.find({ _id: { $in: authorIds } }).lean();
  const byId = new Map(authors.map((a) => [a._id.toString(), a]));

  let likedSet = new Set();
  if (currentUserId) {
    const likes = await Like.find({
      userId: currentUserId,
      postId: { $in: posts.map((p) => p._id) },
    }).lean();
    likedSet = new Set(likes.map((l) => l.postId.toString()));
  }

  return posts.map((p) => {
    const author = byId.get(p.authorId.toString());
    return {
      id: p._id.toString(),
      courseId: p.courseId.toString(),
      title: p.title,
      body: p.body,
      likeCount: p.likeCount,
      replyCount: p.replyCount,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      author: author
        ? { id: author._id.toString(), displayName: author.displayName }
        : { id: null, displayName: '[deleted]' },
      likedByMe: likedSet.has(p._id.toString()),
    };
  });
}

// GET /api/courses/:courseId/posts?sort=latest|hot
router.get('/courses/:courseId/posts', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.courseId)) {
      throw new ApiError(400, 'invalid_id', 'Invalid course id');
    }
    const sort = req.query.sort === 'hot' ? { likeCount: -1, createdAt: -1 } : { createdAt: -1 };
    const posts = await Post.find({ courseId: req.params.courseId }).sort(sort).limit(100).lean();
    res.json(await hydrate(posts, req.user.userId));
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:id  — single post with inline replies
router.get('/posts/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'invalid_id', 'Invalid post id');
    }
    const post = await Post.findById(req.params.id).lean();
    if (!post) throw new ApiError(404, 'post_not_found', 'Post not found');
    const [hydrated] = await hydrate([post], req.user.userId);

    const replies = await Reply.find({ postId: post._id }).sort({ createdAt: 1 }).lean();
    const replyAuthorIds = [...new Set(replies.map((r) => r.authorId.toString()))];
    const replyAuthors = await User.find({ _id: { $in: replyAuthorIds } }).lean();
    const replyById = new Map(replyAuthors.map((a) => [a._id.toString(), a]));
    hydrated.replies = replies.map((r) => {
      const a = replyById.get(r.authorId.toString());
      return {
        id: r._id.toString(),
        body: r.body,
        createdAt: r.createdAt,
        author: a
          ? { id: a._id.toString(), displayName: a.displayName }
          : { id: null, displayName: '[deleted]' },
      };
    });

    res.json(hydrated);
  } catch (err) {
    next(err);
  }
});

// POST /api/courses/:courseId/posts
router.post('/courses/:courseId/posts', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.courseId)) {
      throw new ApiError(400, 'invalid_id', 'Invalid course id');
    }
    const course = await Course.findById(req.params.courseId);
    if (!course) throw new ApiError(404, 'course_not_found', 'Course not found');

    const { title, body } = req.body || {};
    if (!title || !body) throw new ApiError(400, 'missing_fields', 'title and body required');

    const post = await Post.create({
      courseId: course._id,
      authorId: req.user.userId,
      title: String(title).trim().slice(0, 200),
      body: String(body).slice(0, 10000),
    });
    const [hydrated] = await hydrate([post.toObject()], req.user.userId);
    res.status(201).json(hydrated);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/posts/:id
router.patch('/posts/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'invalid_id', 'Invalid post id');
    }
    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'post_not_found', 'Post not found');
    if (post.authorId.toString() !== req.user.userId) {
      throw new ApiError(403, 'forbidden', 'You can only edit your own posts');
    }
    const { title, body } = req.body || {};
    if (title !== undefined) post.title = String(title).trim().slice(0, 200);
    if (body !== undefined) post.body = String(body).slice(0, 10000);
    await post.save();
    const [hydrated] = await hydrate([post.toObject()], req.user.userId);
    res.json(hydrated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/posts/:id  — cascade replies + likes
router.delete('/posts/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, 'invalid_id', 'Invalid post id');
    }
    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'post_not_found', 'Post not found');
    if (post.authorId.toString() !== req.user.userId) {
      throw new ApiError(403, 'forbidden', 'You can only delete your own posts');
    }
    await Promise.all([
      Reply.deleteMany({ postId: post._id }),
      Like.deleteMany({ postId: post._id }),
      post.deleteOne(),
    ]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
