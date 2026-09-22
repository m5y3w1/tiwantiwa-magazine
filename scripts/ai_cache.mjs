import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CACHE_DIR = path.join(process.cwd(), '.cache', 'ai');

export function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function getCachedResponse(prompt) {
  try {
    ensureCacheDir();
    const hash = crypto.createHash('sha256').update(prompt).digest('hex');
    const cacheFile = path.join(CACHE_DIR, `${hash}.json`);
    if (fs.existsSync(cacheFile)) {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      console.log('[+] Cache hit for AI generation request.');
      return data.response;
    }
  } catch (e) {
    console.error('Cache read error:', e);
  }
  return null;
}

export function setCachedResponse(prompt, response) {
  try {
    ensureCacheDir();
    const hash = crypto.createHash('sha256').update(prompt).digest('hex');
    const cacheFile = path.join(CACHE_DIR, `${hash}.json`);
    fs.writeFileSync(cacheFile, JSON.stringify({ prompt, response, timestamp: Date.now() }, null, 2), 'utf8');
  } catch (e) {
    console.error('Cache write error:', e);
  }
}

export async function rateLimitedFetch(url, options = {}, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        console.warn(`[!] Rate limited (429). Retrying in ${delay}ms (attempt ${attempt}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error('Max retries reached for rate-limited fetch');
}
