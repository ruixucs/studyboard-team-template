/**
 * One-time build: download the latest McGill course catalog (CC0) from
 * mcgill-courses/mcgill.courses on GitHub, trim to the fields we need, and
 * write to server/data/mcgill-catalog.json. The output is committed so
 * teammates don't need to run this — it only needs to be re-run when refreshing
 * the catalog year.
 *
 *   npm run build:catalog
 */
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC =
  'https://raw.githubusercontent.com/mcgill-courses/mcgill.courses/master/seed/courses-2025-2026.json';
const OUT = path.join(__dirname, '..', 'data', 'mcgill-catalog.json');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        let buf = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (buf += c));
        res.on('end', () => resolve(buf));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

async function main() {
  console.log('[build:catalog] downloading from', SRC);
  const raw = await fetch(SRC);
  console.log('[build:catalog] parsing', (raw.length / 1024 / 1024).toFixed(2), 'MB JSON');

  const courses = JSON.parse(raw);
  const trimmed = courses
    .filter((c) => c && c._id && c.subject && c.code && c.title && c.faculty)
    .map((c) => ({
      id: c._id,
      subject: c.subject,
      code: c.code,
      title: c.title,
      faculty: c.faculty,
    }));

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(trimmed));
  const sizeKB = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`[build:catalog] wrote ${trimmed.length} courses to ${OUT} (${sizeKB} KB)`);
}

main().catch((err) => {
  console.error('[build:catalog] failed:', err);
  process.exit(1);
});
