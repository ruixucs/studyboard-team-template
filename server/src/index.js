import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb } from './lib/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import coursesRouter from './routes/courses.js';
import meRouter from './routes/me.js';
import postsRouter from './routes/posts.js';
import repliesRouter from './routes/replies.js';
import likesRouter from './routes/likes.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'course-collab-server', time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/me', meRouter);
app.use('/api', postsRouter);
app.use('/api', repliesRouter);
app.use('/api', likesRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
connectDb()
  .then(() => app.listen(PORT, () => console.log(`[server] listening on :${PORT}`)))
  .catch((err) => {
    console.error('[db] connection failed:', err.message);
    process.exit(1);
  });
