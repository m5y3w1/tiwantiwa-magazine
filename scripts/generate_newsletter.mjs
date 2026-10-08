import fs from 'fs';
import path from 'path';

const PUBLISHED_DIR = path.join('/home/earth/digital-magazine', 'content', 'published');
const PUBLIC_DIR = path.join('/home/earth/digital-magazine', 'public');

function parseFrontmatter(content) {
  const match = content.match(/^---\s*([\s\S]*?)\s*---([\s\S]*)$/);
  if (!match) return null;
  const fmLines = match[1].split('\n');
  const data = {};
  for (const line of fmLines) {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join(':').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      data[key] = val;
    }
  }
  return data;
}

function generateNewsletter() {
  if (!fs.existsSync(PUBLISHED_DIR)) return;
  const files = fs.readdirSync(PUBLISHED_DIR).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const content = fs.readFileSync(path.join(PUBLISHED_DIR, file), 'utf8');
    const fm = parseFrontmatter(content);
    return {
      slug: file.replace('.md', ''),
      title: fm?.title || file,
      date: fm?.date || new Date().toISOString(),
      category: fm?.category || 'General',
      description: fm?.description || ''
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>[tiwantiwa] Weekly Dispatch Digest</title>
    <style>
        body { background: #09090b; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #18181b; border: 1px: solid #27272a; border-radius: 12px; padding: 40px; }
        h1 { color: #ffffff; font-family: serif; font-size: 28px; margin-bottom: 8px; }
        .tagline { color: #34d399; font-family: monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; }
        .post { margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #27272a; }
        .post-cat { color: #fbbf24; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .post-title a { color: #ffffff; font-family: serif; font-size: 20px; text-decoration: none; font-weight: bold; }
        .post-title a:hover { color: #34d399; }
        .post-desc { color: #a1a1aa; font-size: 14px; line-height: 1.5; margin-top: 8px; }
        .footer { margin-top: 40px; text-top: center; color: #71717a; font-size: 12px; font-family: monospace; border-top: 1px solid #27272a; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>[tiwantiwa] Weekly Dispatch</h1>
        <div class="tagline">Chronicles of Nigeria &amp; The Global Diaspora</div>
        
        <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
            Here are the most critical dispatches from our autonomous editorial desk this week, covering technology, business, culture, and strategy.
        </p>

        ${posts.map(p => `
            <div class="post">
                <div class="post-cat">${p.category}</div>
                <div class="post-title"><a href="https://tiwantiwa.com/posts/${p.slug}/">${p.title}</a></div>
                <div class="post-desc">${p.description}</div>
            </div>
        `).join('')}

        <div class="footer">
            &copy; 2026 tiwantiwa.com &bull; Enterprise Digital Magazine Infrastructure<br>
            <a href="https://tiwantiwa.com" style="color: #34d399; text-decoration: none;">Visit Portal &rarr;</a>
        </div>
    </div>
</body>
</html>`;

  const outPath = path.join(PUBLIC_DIR, 'newsletter-digest.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`[+] Weekly newsletter digest generated at ${outPath}`);
}

generateNewsletter();
