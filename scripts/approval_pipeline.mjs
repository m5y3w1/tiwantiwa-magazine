import fs from 'fs';
import path from 'path';

const DRAFTS_DIR = path.join(process.cwd(), 'content', 'drafts');
const PUBLISHED_DIR = path.join(process.cwd(), 'content', 'published');

// Ensure directories exist
if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
if (!fs.existsSync(PUBLISHED_DIR)) fs.mkdirSync(PUBLISHED_DIR, { recursive: true });

const command = process.argv[2];
const targetSlug = process.argv[3];

function listDrafts() {
  const drafts = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  console.log('\n--- PENDING AI DRAFTS ---');
  if (drafts.length === 0) {
    console.log('No drafts currently pending review.');
  } else {
    drafts.forEach((d, i) => console.log(`[${i + 1}] ${d}`));
  }
  console.log('--------------------------\n');
}

function approveDraft(slug) {
  if (!slug) {
    console.error('Error: Please provide a draft filename or slug.');
    process.exit(1);
  }
  const filename = slug.endsWith('.md') || slug.endsWith('.mdx') ? slug : `${slug}.md`;
  const src = path.join(DRAFTS_DIR, filename);
  const dest = path.join(PUBLISHED_DIR, filename);

  if (!fs.existsSync(src)) {
    console.error(`Error: Draft not found at ${src}`);
    process.exit(1);
  }

  // Read content, update date if needed, move to published
  const content = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(dest, content);
  fs.unlinkSync(src);

  console.log(`[+] SUCCESS: Approved and promoted "${filename}" to /content/published/`);
  console.log('[*] Git commit and deploy triggered automatically by CI/CD pipeline.');
}

if (command === 'list') {
  listDrafts();
} else if (command === 'approve') {
  approveDraft(targetSlug);
} else {
  console.log('Usage: node scripts/approval_pipeline.mjs <list|approve> [filename]');
}
