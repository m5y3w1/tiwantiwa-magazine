import fs from 'fs';
import path from 'path';
import { generateCyberCodeCover } from './generate_cybercode_covers.mjs';

const PUBLISHED_DIR = path.join('/home/earth/digital-magazine', 'content', 'published');

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
      if (key === 'tags') {
        // parse array like ["a", "b"]
        try {
          val = eval(val);
        } catch {
          val = [val];
        }
      }
      data[key] = val;
    }
  }
  return data;
}

function updateCovers() {
  const files = fs.readdirSync(PUBLISHED_DIR).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const filePath = path.join(PUBLISHED_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) continue;

    const slug = file.replace(/\.md$/, '');
    const title = fm.title || slug;
    const category = fm.category || 'nigeria';
    const tags = Array.isArray(fm.tags) ? fm.tags : ['Nigeria', 'Digital', 'Edition'];

    const svgPath = generateCyberCodeCover(slug, title, category, tags);
    
    // Update cover_image in frontmatter
    const updatedContent = content.replace(/cover_image:\s*"[^"]*"/, `cover_image: "${svgPath}"`);
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  }
  console.log('[+] All CyberCode narrative covers generated successfully!');
}

updateCovers();
