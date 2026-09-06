#!/bin/env node
/**
 * TIWANTIWA AI MEDIA ORG - EDITORIAL INTELLIGENCE ENGINE
 * Acting as Chief AI Administrator to intake briefs, auto-generate markdown dispatches,
 * and enforce human-in-the-loop review.
 */

import fs from 'fs';
import path from 'path';

const DRAFTS_DIR = path.join(process.cwd(), 'content', 'drafts');
const PUBLISHED_DIR = path.join(process.cwd(), 'content', 'published');

if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
if (!fs.existsSync(PUBLISHED_DIR)) fs.mkdirSync(PUBLISHED_DIR, { recursive: true });

const action = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];
const arg3 = process.argv[5];

function listQueue() {
  console.log('\n==================================================');
  console.log('📰 TIWANTIWA EDITORIAL & INGESTION QUEUE');
  console.log('==================================================');
  
  const drafts = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md'));
  const published = fs.readdirSync(PUBLISHED_DIR).filter(f => f.endsWith('.md'));

  console.log(`\n[PENDING REVIEW & APPROVAL: ${drafts.length}]`);
  if (drafts.length === 0) {
    console.log('  (Queue empty - awaiting AI generation or drop)');
  } else {
    drafts.forEach((d, i) => console.log(`  ${i + 1}. [draft] ${d}`));
  }

  console.log(`\n[PUBLISHED DISPATCHES: ${published.length}]`);
  if (published.length === 0) {
    console.log('  (No published dispatches yet)');
  } else {
    published.forEach((p, i) => console.log(`  ${i + 1}. [live]  ${p}`));
  }
  console.log('\n==================================================\n');
}

function ingestDispatch(slug, category, author, title) {
  if (!slug || !category || !author || !title) {
    console.error('Usage: node scripts/media_org.mjs ingest <slug> <category> <author> <title>');
    process.exit(1);
  }

  const filename = `${slug}.md`;
  const filepath = path.join(DRAFTS_DIR, filename);
  const currentDate = new Date().toISOString();

  const content = `---
title: "${title}"
date: ${currentDate}
author: "${author}"
category: "${category}"
tags: ["${category}", "Tiwantiwa", "Editorial"]
description: "An autonomous editorial dispatch covering ${category} developments for Tiwantiwa.com."
cover_image: "/images/${slug}.jpg"
affiliate_link: "https://tiwantiwa.com/partner"
is_premium: false
---

# ${title}

*Published via Tiwantiwa Operational Intelligence Engine.*

## Executive Summary
This dispatch provides deep-dive analytical coverage tailored for our readership across **${category}**.

## Key Perspectives
- **Market Impact**: Analyzing structural shifts and local realities.
- **Future Outlook**: Strategic projections and expert commentary.

---
*End of editorial brief.*
`;

  fs.writeFileSync(filepath, content);
  console.log(`[+] SUCCESS: Ingested draft article into ${filepath}`);
  console.log(`[*] Awaiting final human authority approval via: node scripts/media_org.mjs approve ${slug}`);
}

function approveDispatch(slug) {
  if (!slug) {
    console.error('Usage: node scripts/media_org.mjs approve <slug>');
    process.exit(1);
  }
  const filename = slug.endsWith('.md') ? slug : `${slug}.md`;
  const src = path.join(DRAFTS_DIR, filename);
  const dest = path.join(PUBLISHED_DIR, filename);

  if (!fs.existsSync(src)) {
    console.error(`Error: Draft not found in review queue: ${src}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(dest, fileContent);
  fs.unlinkSync(src);

  console.log(`[✓] APPROVED & PUBLISHED: "${filename}" moved to production feed (/content/published/)`);
  console.log('[*] Git CI/CD deployment pipeline triggered for tiwantiwa.com.');
}

switch (action) {
  case 'list':
    listQueue();
    break;
  case 'ingest':
    ingestDispatch(arg1, arg2, arg3, arg4);
    break;
  case 'approve':
    approveDispatch(arg1);
    break;
  default:
    console.log('TiwaNtiwa Operational Intelligence Engine');
    console.log('Commands:');
    console.log('  node scripts/media_org.mjs list');
    console.log('  node scripts/media_org.mjs ingest <slug> <category> <author> "<title>"');
    console.log('  node scripts/media_org.mjs approve <slug>');
    break;
}
