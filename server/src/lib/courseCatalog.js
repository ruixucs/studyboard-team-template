import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, '..', '..', 'data', 'mcgill-catalog.json');

let byId;
function load() {
  if (byId) return byId;
  const raw = fs.readFileSync(CATALOG_PATH, 'utf-8');
  const data = JSON.parse(raw);
  byId = new Map(data.map((c) => [c.id, c]));
  return byId;
}

export function normalizeCode(input) {
  return String(input || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

export function lookupCatalog(input) {
  return load().get(normalizeCode(input)) || null;
}

export function formatDisplayCode(catalogEntry) {
  return `${catalogEntry.subject} ${catalogEntry.code}`;
}
