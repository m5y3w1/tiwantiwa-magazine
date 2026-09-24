import fs from 'fs';
import path from 'path';
import http from 'http';
import url from 'url';

const DRAFTS_DIR = path.join('/home/earth/digital-magazine', 'content', 'drafts');
const PUBLISHED_DIR = path.join('/home/earth/digital-magazine', 'content', 'published');
const ARCHIVE_DIR = path.join('/home/earth/digital-magazine', 'content', 'archive');

if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

function parseFrontmatter(content) {
  const match = content.match(/^---\s*([\s\S]*?)\s*---([\s\S]*)$/);
  if (!match) return { data: {}, body: content };
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
  return { data, body: match[2].trim() };
}

function getDrafts() {
  if (!fs.existsSync(DRAFTS_DIR)) return [];
  return fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md')).map(file => {
    const filePath = path.join(DRAFTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, body } = parseFrontmatter(content);
    return {
      slug: file.replace('.md', ''),
      filename: file,
      title: data.title || file,
      category: data.category || 'general',
      description: data.description || '',
      words: body.split(/\s+/).length,
      body: body.slice(0, 300) + '...'
    };
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const slug = params.get('slug');
      if (slug) {
        const src = path.join(DRAFTS_DIR, `${slug}.md`);
        if (fs.existsSync(src)) {
          if (pathname === '/publish') {
            const dest = path.join(PUBLISHED_DIR, `${slug}.md`);
            fs.renameSync(src, dest);
          } else if (pathname === '/archive') {
            const dest = path.join(ARCHIVE_DIR, `${slug}.md`);
            fs.renameSync(src, dest);
          }
        }
      }
      res.writeHead(302, { 'Location': '/' });
      res.end();
    });
    return;
  }

  const drafts = getDrafts();

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html lang="en" class="bg-zinc-950 text-zinc-100">
<head>
    <meta charset="UTF-8">
    <title>[tiwantiwa] Editorial Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen p-8">
    <div class="max-w-5xl mx-auto space-y-8">
        <header class="border-b border-zinc-800 pb-6 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-serif font-bold text-white flex items-center gap-2">
                    <span class="text-emerald-400">[</span>tiwantiwa<span class="text-emerald-400">]</span> Editorial Dashboard
                </h1>
                <p class="text-sm text-zinc-400 mt-1">Human-in-the-loop review, publishing, and archiving queue</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-mono">
                ${drafts.length} Drafts Pending
            </span>
        </header>

        <main class="grid gap-6">
            ${drafts.length === 0 ? `
                <div class="p-12 text-center rounded-2xl bg-zinc-900 border border-zinc-800">
                    <p class="text-zinc-400 font-serif">No pending drafts in queue. All dispatches have been processed!</p>
                </div>
            ` : drafts.map(d => `
                <article class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                    <div class="flex items-center justify-between text-xs text-zinc-400 font-mono">
                        <span class="px-2.5 py-1 rounded bg-zinc-800 text-emerald-400 uppercase tracking-widest">${d.category}</span>
                        <span>${d.words} words</span>
                    </div>
                    <h2 class="text-xl font-serif font-bold text-white">${d.title}</h2>
                    <p class="text-sm text-zinc-300 italic">${d.description}</p>
                    <p class="text-xs text-zinc-500 font-mono bg-zinc-950 p-3 rounded-lg border border-zinc-800/50">${d.body}</p>
                    <div class="pt-2 flex justify-end gap-3">
                        <form action="/archive" method="POST">
                            <input type="hidden" name="slug" value="${d.slug}">
                            <button type="submit" class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs uppercase tracking-widest font-semibold transition-colors border border-zinc-700">
                                Archive Draft
                            </button>
                        </form>
                        <form action="/publish" method="POST">
                            <input type="hidden" name="slug" value="${d.slug}">
                            <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-widest font-semibold transition-colors">
                                Approve &amp; Publish &rarr;
                            </button>
                        </form>
                    </div>
                </article>
            `).join('')}
        </main>
    </div>
</body>
</html>`);
});

server.listen(5000, '127.0.0.1', () => {
  console.log('[+] Editorial Web Dashboard running at http://127.0.0.1:5000');
});
