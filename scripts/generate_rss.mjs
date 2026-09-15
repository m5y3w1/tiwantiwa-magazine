import fs from 'fs';
import path from 'path';

const PUBLISHED_DIR = path.join('/home/earth/digital-magazine/content', 'published');
const PUBLIC_DIR = path.join('/home/earth/digital-magazine', 'public');
const RSS_PATH = path.join(PUBLIC_DIR, 'rss.xml');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

function generateRSS() {
  const files = fs.readdirSync(PUBLISHED_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  const items = files.map(filename => {
    const filePath = path.join(PUBLISHED_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;
    
    const fmLines = match[1].split('\n');
    const fm = {};
    fmLines.forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim().replace(/^["'](.*)["']$/, '$1');
        fm[key] = val;
      }
    });

    const slug = filename.replace(/\.mdx?$/, '');
    const title = fm.title || slug;
    const description = fm.description || '';
    const date = fm.date ? new Date(fm.date).toUTCString() : new Date().toUTCString();
    const link = `https://tiwantiwa.com/posts/${slug}/`;

    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
  }).filter(Boolean).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>tiwantiwa — Enterprise Digital Magazine</title>
    <link>https://tiwantiwa.com</link>
    <description>Nigeria, Diaspora, Business, Tech, Culture, Lifestyle, People, and Opinions.</description>
    <language>en-us</language>
    <atom:link href="https://tiwantiwa.com/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  fs.writeFileSync(RSS_PATH, rss);
  console.log('[+] RSS feed successfully generated at /public/rss.xml');
}

generateRSS();
