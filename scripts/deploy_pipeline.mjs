#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

console.log('╔════════════════════════════════════════╗');
console.log('║  HERMES DEPLOY PIPELINE: TIWANTIWA   ║');
console.log('╚════════════════════════════════════════╝');

console.log('[1/5] Running production build...');
execSync('npm run build', { cwd: '/home/earth/digital-magazine', stdio: 'inherit' });

console.log('[2/5] Regenerating RSS feed...');
execSync('node scripts/generate_rss.mjs', { cwd: '/home/earth/digital-magazine', stdio: 'inherit' });

console.log('[3/5] Regenerating sitemap...');
execSync('node scripts/generate_sitemap.mjs', { cwd: '/home/earth/digital-magazine', stdio: 'inherit' });

console.log('[4/5] Running health check...');
execSync('node scripts/health_check.mjs', { cwd: '/home/earth/digital-magazine', stdio: 'inherit' });

console.log('[5/5] Committing and pushing to GitHub...');
try {
  execSync('git add -A', { cwd: '/home/earth/digital-magazine', stdio: 'inherit' });
  execSync('git commit -m "hermes-deploy: automated pipeline run"', { cwd: '/home/earth/digital-magazine', stdio: 'inherit' });
  execSync('git push origin main', { cwd: '/home/earth/digital-magazine', stdio: 'inherit' });
  console.log('[✓] Push complete. Vercel will redeploy automatically.');
} catch (e) {
  console.log('[!] Push skipped (requires active PAT). Run manually: git push origin main');
}

console.log('[✓] Hermes Deploy Pipeline complete.');
console.log('Live site: https://tiwantiwa.com');
console.log('Local preview: http://localhost:4321');
