import 'dotenv/config';
import { connectDb } from '../src/lib/db.js';
import { Course } from '../src/models/Course.js';
import mongoose from 'mongoose';

const COURSES = [
  // Computer Science
  { code: 'COMP 202', name: 'Foundations of Programming', faculty: 'Computer Science' },
  { code: 'COMP 206', name: 'Introduction to Software Systems', faculty: 'Computer Science' },
  { code: 'COMP 250', name: 'Introduction to Computer Science', faculty: 'Computer Science' },
  { code: 'COMP 251', name: 'Algorithms and Data Structures', faculty: 'Computer Science' },
  { code: 'COMP 273', name: 'Introduction to Computer Systems', faculty: 'Computer Science' },
  { code: 'COMP 302', name: 'Programming Languages and Paradigms', faculty: 'Computer Science' },
  { code: 'COMP 303', name: 'Software Design', faculty: 'Computer Science' },
  { code: 'COMP 307', name: 'Introduction to Web Development', faculty: 'Computer Science' },
  { code: 'COMP 310', name: 'Operating Systems', faculty: 'Computer Science' },
  { code: 'COMP 321', name: 'Programming Challenges', faculty: 'Computer Science' },
  { code: 'COMP 330', name: 'Theory of Computation', faculty: 'Computer Science' },
  { code: 'COMP 335', name: 'Software Engineering Methods', faculty: 'Computer Science' },
  { code: 'COMP 350', name: 'Numerical Computing', faculty: 'Computer Science' },
  { code: 'COMP 352', name: 'Computational Complexity', faculty: 'Computer Science' },
  { code: 'COMP 360', name: 'Algorithm Design', faculty: 'Computer Science' },
  { code: 'COMP 421', name: 'Database Systems', faculty: 'Computer Science' },
  { code: 'COMP 424', name: 'Artificial Intelligence', faculty: 'Computer Science' },
  { code: 'COMP 520', name: 'Compiler Design', faculty: 'Computer Science' },
  { code: 'COMP 551', name: 'Applied Machine Learning', faculty: 'Computer Science' },
  // Math
  { code: 'MATH 133', name: 'Linear Algebra and Geometry', faculty: 'Mathematics' },
  { code: 'MATH 140', name: 'Calculus 1', faculty: 'Mathematics' },
  { code: 'MATH 141', name: 'Calculus 2', faculty: 'Mathematics' },
  { code: 'MATH 222', name: 'Calculus 3', faculty: 'Mathematics' },
  { code: 'MATH 240', name: 'Discrete Structures', faculty: 'Mathematics' },
  { code: 'MATH 323', name: 'Probability', faculty: 'Mathematics' },
  { code: 'MATH 324', name: 'Statistics', faculty: 'Mathematics' },
  { code: 'MATH 363', name: 'Discrete Mathematics', faculty: 'Mathematics' },
  // Physics
  { code: 'PHYS 101', name: 'Mechanics', faculty: 'Physics' },
  { code: 'PHYS 102', name: 'Electromagnetism and Optics', faculty: 'Physics' },
  { code: 'PHYS 142', name: 'Electromagnetism and Optics', faculty: 'Physics' },
  // Chemistry / Biology
  { code: 'CHEM 110', name: 'General Chemistry 1', faculty: 'Chemistry' },
  { code: 'CHEM 120', name: 'General Chemistry 2', faculty: 'Chemistry' },
  { code: 'BIOL 111', name: 'Principles: Organismal Biology', faculty: 'Biology' },
  { code: 'BIOL 112', name: 'Cell and Molecular Biology', faculty: 'Biology' },
  // Economics
  { code: 'ECON 208', name: 'Microeconomic Analysis', faculty: 'Economics' },
  { code: 'ECON 209', name: 'Macroeconomic Analysis', faculty: 'Economics' },
  { code: 'ECON 230', name: 'Microeconomic Theory', faculty: 'Economics' },
  // Writing
  { code: 'CCOM 206', name: 'Communication in Engineering', faculty: 'Communication' },
  { code: 'ENGL 203', name: 'Introduction to Cultural Studies', faculty: 'English' },
];

async function main() {
  await connectDb();
  let added = 0;
  let skipped = 0;
  for (const c of COURSES) {
    const existing = await Course.findOne({ code: c.code });
    if (existing) {
      skipped++;
      continue;
    }
    await Course.create(c);
    added++;
  }
  console.log(`[seed] done: added ${added}, skipped (already existed) ${skipped}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
