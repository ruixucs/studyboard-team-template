/**
 * Dev-only seed: creates a test user + enrollment + posts + reply + like
 * so any teammate can develop and test their feature WITHOUT waiting for
 * the other two to finish.
 *
 * Run AFTER `npm run seed` (which creates the courses).
 *
 *   npm run seed:dev
 *
 * Login credentials printed at the end:
 *   email:    devuser@mail.mcgill.ca
 *   password: devpass123
 *
 * Idempotent — safe to run repeatedly.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDb } from '../src/lib/db.js';
import { User } from '../src/models/User.js';
import { Course } from '../src/models/Course.js';
import { Enrollment } from '../src/models/Enrollment.js';
import { Post } from '../src/models/Post.js';
import { Reply } from '../src/models/Reply.js';
import { Like } from '../src/models/Like.js';

const TEST_EMAIL = 'devuser@mail.mcgill.ca';
const TEST_PASSWORD = 'devpass123';
const ENROLL_CODES = ['COMP 307', 'COMP 251'];

async function main() {
  await connectDb();

  // 1. Test user (registered with bcrypt hash so login works normally)
  let user = await User.findOne({ email: TEST_EMAIL });
  if (!user) {
    user = await User.create({
      email: TEST_EMAIL,
      displayName: 'Dev User',
      passwordHash: await bcrypt.hash(TEST_PASSWORD, 10),
    });
    console.log('[seed-dev] created user:', TEST_EMAIL);
  } else {
    console.log('[seed-dev] user already exists:', TEST_EMAIL);
  }

  // 2. Sanity check — courses must already exist (run `npm run seed` first)
  const courseCount = await Course.estimatedDocumentCount();
  if (courseCount === 0) {
    console.error('[seed-dev] no courses in DB. Run `npm run seed` first.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // 3. Enroll user in a couple of courses
  const courses = await Course.find({ code: { $in: ENROLL_CODES } });
  for (const c of courses) {
    await Enrollment.updateOne(
      { userId: user._id, courseId: c._id },
      { $setOnInsert: { userId: user._id, courseId: c._id } },
      { upsert: true }
    );
    console.log('[seed-dev] enrolled in:', c.code);
  }

  // 4. Sample posts in COMP 307 (with reply + like, so the activity counters look real)
  const comp307 = courses.find((c) => c.code === 'COMP 307');
  if (comp307) {
    const samplePosts = [
      {
        title: 'Welcome to COMP 307',
        body:
          'This is a sample post seeded for development.\n\n' +
          '```js\nconsole.log("hello from seed-dev")\n```\n\n' +
          'Use this to test list rendering, post detail, replies, and likes.',
      },
      {
        title: 'Anyone has notes for the midterm?',
        body: 'Missed last week. Would appreciate a hand. Thanks!',
      },
      {
        title: 'Looking for project teammates',
        body:
          'Building the SOCS Booking app for the project. We have 2, looking for 2 more. ' +
          'DM me if interested!',
      },
    ];
    for (const p of samplePosts) {
      const exists = await Post.findOne({ courseId: comp307._id, title: p.title });
      if (exists) continue;
      const post = await Post.create({
        courseId: comp307._id,
        authorId: user._id,
        title: p.title,
        body: p.body,
      });
      // Add one reply, bump replyCount
      await Reply.create({
        postId: post._id,
        authorId: user._id,
        body: 'Sample reply seeded for dev.',
      });
      await Post.updateOne({ _id: post._id }, { $inc: { replyCount: 1 } });
      // Self-like, bump likeCount (so Profile shows non-zero `totalLikesReceived`)
      try {
        await Like.create({ userId: user._id, postId: post._id });
        await Post.updateOne({ _id: post._id }, { $inc: { likeCount: 1 } });
      } catch (err) {
        if (err.code !== 11000) throw err; // already liked: ignore
      }
      console.log('[seed-dev] created post:', p.title);
    }
  }

  console.log('\n[seed-dev] done. You can now log in with:');
  console.log('  email:    ' + TEST_EMAIL);
  console.log('  password: ' + TEST_PASSWORD);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('[seed-dev] failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
