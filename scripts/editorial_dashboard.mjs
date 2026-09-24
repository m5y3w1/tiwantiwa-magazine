#!/usr/bin/env node
/**
 * TIWANTIWA EDITORIAL DASHBOARD (CLI)
 * Rapid batch review, scoring, and approval for incoming dispatches.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const DRAFTS_DIR = path.join('/home/earth/digital-magazine', 'content', 'drafts');
const PUBLISHED_DIR = path.join('/home/earth/digital-magazine', 'content', 'published');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getDrafts() {
  if (!fs.existsSync(DRAFTS_DIR)) return [];
  return fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md'));
}

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

function scoreDraft(body, title) {
  let score = 70;
  if (body.length > 800) score += 15;
  if (title.length > 20 && title.length < 90) score += 10;
  if (body.includes('###')) score += 5;
  return Math.min(score, 100);
}

function showMenu() {
  const drafts = getDrafts();
  console.clear();
  console.log('==================================================');
  console.log('       [tiwantiwa] EDITORIAL BATCH DASHBOARD       ');
  console.log('==================================================');
  console.log(`Pending Drafts in Queue: ${drafts.length}\n`);

  if (drafts.length === 0) {
    console.log('No pending drafts found in /content/drafts/.');
    rl.close();
    return;
  }

  drafts.forEach((file, index) => {
    const content = fs.readFileSync(path.join(DRAFTS_DIR, file), 'utf8');
    const { data, body } = parseFrontmatter(content);
    const score = scoreDraft(body, data.title || file);
    console.log(`[${index + 1}] ${data.title || file}`);
    console.log(`    Category: ${data.category || 'general'} | Score: ${score}/100 | Words: ${body.split(/\s+/).length}`);
  });

  console.log('\nOptions:');
  console.log('  [1-N] Review & Publish specific draft');
  console.log('  [a]   Approve & Publish ALL drafts');
  console.log('  [q]   Quit dashboard');
  console.log('--------------------------------------------------');

  rl.question('\nSelect an action: ', async (answer) => {
    const choice = answer.trim().toLowerCase();
    if (choice === 'q') {
      console.log('Exiting dashboard.');
      rl.close();
      return;
    }

    if (choice === 'a') {
      console.log('\n[+] Publishing all pending drafts...');
      for (const file of drafts) {
        const src = path.join(DRAFTS_DIR, file);
        const dest = path.join(PUBLISHED_DIR, file);
        fs.renameSync(src, dest);
        console.log(`  -> Published: ${file}`);
      }
      console.log('[✓] All drafts published successfully!');
      setTimeout(showMenu, 2000);
      return;
    }

    const idx = parseInt(choice, 10);
    if (!isNaN(idx) && idx >= 1 && idx <= drafts.length) {
      const selectedFile = drafts[idx - 1];
      const filePath = path.join(DRAFTS_DIR, selectedFile);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, body } = parseFrontmatter(content);

      console.clear();
      console.log(`==================================================`);
      console.log(` REVIEW: ${data.title || selectedFile}`);
      console.log(`==================================================`);
      console.log(`Category: ${data.category}`);
      console.log(`Description: ${data.description}\n`);
      console.log(body.slice(0, 500) + '...\n');
      console.log('--------------------------------------------------');
      
      rl.question('Publish this dispatch? (y/n): ', (conf) => {
        if (conf.toLowerCase() === 'y') {
          const dest = path.join(PUBLISHED_DIR, selectedFile);
          fs.renameSync(filePath, dest);
          console.log(`[✓] Published ${selectedFile} successfully!`);
        } else {
          console.log('[!] Skipped publishing.');
        }
        setTimeout(showMenu, 2000);
      });
      return;
    }

    setTimeout(showMenu, 1000);
  });
}

showMenu();
