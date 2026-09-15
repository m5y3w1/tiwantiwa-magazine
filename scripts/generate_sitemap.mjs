import fs from 'fs';
import path from 'path';

const PUBLISHED_DIR = path.join('/home/earth/digital-magazine/content', 'published');
const SITEMAP_PATH = path.join('/home/earth/digital-magazine/public', 'sitemap-index.xml');

function generateSitemap() {
  console.log('[*] Generating XML Sitemap...');

  const files = fs.readdirSync(PUBLISHED_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  const postUrls = files.map(filename => {
    const slug = filename.replace(/\.mdx?$/, '');
    return `  <url>
    <loc>https://tiwantiwa.com/posts/${slug}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  const staticUrls = [
    '',
    'about/',
    'contact/',
    'editorial-policy/',
    'category/nigeria/',
    'category/diaspora/',
    'category/business/',
    'category/technology/',
    'category/culture/',
    'category/lifestyle/',
    'category/people/',
    'category/opinions/'
  ].map(route => `  <url>
    <loc>https://tiwantiwa.com/${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '' ? '1.0' : '0.7'}</priority>
  </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log('[+] XML Sitemap successfully generated at /public/sitemap-index.xml');
}

generateSitemap();
