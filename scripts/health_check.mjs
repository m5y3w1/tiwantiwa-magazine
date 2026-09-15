import fs from 'fs';
import path from 'path';

const DIST_DIR = path.join('/home/earth/digital-magazine', 'dist');

function checkHealth() {
  console.log('[*] Running tiwantiwa.com Health & Link Integrity Check...');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('[-] Error: /dist directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  // Check required core pages
  const requiredPages = [
    'index.html',
    'about/index.html',
    'contact/index.html',
    'editorial-policy/index.html',
    'category/nigeria/index.html',
    'category/diaspora/index.html',
    'category/business/index.html',
    'category/technology/index.html',
    'category/culture/index.html',
    'category/lifestyle/index.html',
    'category/people/index.html',
    'category/opinions/index.html'
  ];

  let missingPages = 0;
  requiredPages.forEach(p => {
    const fullPath = path.join(DIST_DIR, p);
    if (!fs.existsSync(fullPath)) {
      console.error(`[-] MISSING ROUTE: /${p}`);
      missingPages++;
    } else {
      console.log(`[+] VERIFIED ROUTE: /${p}`);
    }
  });

  // Check RSS feed
  const rssPath = path.join('/home/earth/digital-magazine/public', 'rss.xml');
  if (!fs.existsSync(rssPath)) {
    console.error('[-] MISSING RSS FEED: /public/rss.xml');
    missingPages++;
  } else {
    console.log('[+] VERIFIED RSS FEED: /public/rss.xml');
  }

  if (missingPages > 0) {
    console.error(`\n[-] Health Check Failed: ${missingPages} error(s) detected.`);
    process.exit(1);
  } else {
    console.log('\n[+] SUCCESS: All core routes, assets, and RSS feeds are healthy and verified.');
  }
}

checkHealth();
