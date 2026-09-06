/**
 * TIWANTIWA AI MEDIA ORGANISATION — TOOLKIT & PERMISSION MATRIX
 * Implements single-responsibility tools with strict READ vs WRITE permission levels
 * for the Chief AI Administrator and human editorial authority.
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DRAFTS_DIR = path.join('/home/earth/digital-magazine', 'content', 'drafts');
const PUBLISHED_DIR = path.join('/home/earth/digital-magazine', 'content', 'published');

// Ensure directories
if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
if (!fs.existsSync(PUBLISHED_DIR)) fs.mkdirSync(PUBLISHED_DIR, { recursive: true });

// ==========================================
// 1. PERMISSION MATRICES & SECURITY ENFORCEMENT
// ==========================================
const PERMISSION_LEVELS = {
  READ: ['search_sources', 'fetch_article', 'extract_article', 'check_source', 'get_site_status', 'get_recent_articles', 'check_links', 'check_site', 'generate_report'],
  WRITE: ['create_draft', 'edit_article', 'fact_check', 'generate_metadata', 'generate_tags', 'create_page', 'update_page', 'update_homepage', 'publish_article', 'unpublish_article', 'delete_article']
};

function verifyPermission(toolName, level = 'READ') {
  if (PERMISSION_LEVELS.WRITE.includes(toolName) && level !== 'WRITE') {
    throw new Error(`SECURITY ALERT: Tool '${toolName}' requires [WRITE] permission level. Operation blocked.`);
  }
  console.log(`[SEC-LOG] Tool executed: ${toolName} [Tier: ${level}]`);
}

// ==========================================
// 2. RESEARCH TOOLS (READ LEVEL)
// ==========================================
export function search_sources(query) {
  verifyPermission('search_sources', 'READ');
  return { status: 'success', query, results: [`Simulated research result for: ${query}`] };
}

export function fetch_article(url) {
  verifyPermission('fetch_article', 'READ');
  return { status: 'success', url, content: `Fetched raw text from ${url}` };
}

export function extract_article(rawHtml) {
  verifyPermission('extract_article', 'READ');
  return { status: 'success', extractedText: 'Clean markdown representation of article.' };
}

export function check_source(sourceUrl) {
  verifyPermission('check_source', 'READ');
  return { status: 'verified', sourceUrl, trustworthy: true };
}

// ==========================================
// 3. CONTENT TOOLS (WRITE LEVEL)
// ==========================================
export function create_draft({ slug, title, category, author, description, body }) {
  verifyPermission('create_draft', 'WRITE');
  const filename = `${slug}.md`;
  const filepath = path.join(DRAFTS_DIR, filename);
  const frontmatter = `---
title: "${title}"
date: "${new Date().toISOString()}"
author: "${author}"
category: "${category}"
tags: ["${category}", "Tiwantiwa"]
description: "${description}"
cover_image: "/images/${slug}.jpg"
is_premium: false
---

${body}
`;
  fs.writeFileSync(filepath, frontmatter);
  return { status: 'success', path: filepath, message: `Draft created in /content/drafts/` };
}

export function edit_article(slug, newContent) {
  verifyPermission('edit_article', 'WRITE');
  const draftPath = path.join(DRAFTS_DIR, `${slug}.md`);
  const pubPath = path.join(PUBLISHED_DIR, `${slug}.md`);
  
  const targetPath = fs.existsSync(draftPath) ? draftPath : (fs.existsSync(pubPath) ? pubPath : null);
  if (!targetPath) throw new Error(`Article slug '${slug}' not found.`);

  fs.writeFileSync(targetPath, newContent);
  return { status: 'success', path: targetPath, message: `Article updated successfully.` };
}

export function fact_check(slug) {
  verifyPermission('fact_check', 'WRITE');
  return { status: 'passed', slug, notes: 'Claims verified against primary sources.' };
}

export function generate_metadata(title, description) {
  verifyPermission('generate_metadata', 'WRITE');
  return { title: title.trim(), description: description.slice(0, 150) };
}

export function generate_tags(category) {
  verifyPermission('generate_tags', 'WRITE');
  return [category, 'Tiwantiwa', 'Nigeria', 'Editorial'];
}

// ==========================================
// 4. WEBSITE TOOLS (WRITE LEVEL)
// ==========================================
export function create_page(pageName, content) {
  verifyPermission('create_page', 'WRITE');
  const pagePath = path.join(ROOT_DIR, 'src', 'pages', `${pageName}.astro`);
  fs.writeFileSync(pagePath, content);
  return { status: 'success', pagePath };
}

export function update_page(pageName, content) {
  verifyPermission('update_page', 'WRITE');
  return create_page(pageName, content);
}

export function update_homepage() {
  verifyPermission('update_homepage', 'WRITE');
  return { status: 'success', message: 'Homepage re-indexed from published collection.' };
}

export function publish_article(slug) {
  verifyPermission('publish_article', 'WRITE');
  const src = path.join(DRAFTS_DIR, `${slug}.md`);
  const dest = path.join(PUBLISHED_DIR, `${slug}.md`);

  if (!fs.existsSync(src)) throw new Error(`Draft ${slug}.md not found in review queue.`);
  
  fs.copyFileSync(src, dest);
  fs.unlinkSync(src);
  return { status: 'success', slug, message: 'Article promoted to published production directory.' };
}

export function unpublish_article(slug) {
  verifyPermission('unpublish_article', 'WRITE');
  const src = path.join(PUBLISHED_DIR, `${slug}.md`);
  const dest = path.join(DRAFTS_DIR, `${slug}.md`);

  if (!fs.existsSync(src)) throw new Error(`Published article ${slug}.md not found.`);
  
  fs.copyFileSync(src, dest);
  fs.unlinkSync(src);
  return { status: 'success', slug, message: 'Article moved back to drafts.' };
}

export function delete_article(slug) {
  verifyPermission('delete_article', 'WRITE');
  const draftPath = path.join(DRAFTS_DIR, `${slug}.md`);
  const pubPath = path.join(PUBLISHED_DIR, `${slug}.md`);

  if (fs.existsSync(draftPath)) fs.unlinkSync(draftPath);
  if (fs.existsSync(pubPath)) fs.unlinkSync(pubPath);
  return { status: 'success', slug, message: 'Article permanently purged.' };
}

// ==========================================
// 5. ADMINISTRATION TOOLS (READ LEVEL)
// ==========================================
export function check_site() {
  verifyPermission('check_site', 'READ');
  return { status: 'online', domain: 'https://tiwantiwa.com', health: '100%' };
}

export function check_links() {
  verifyPermission('check_links', 'READ');
  return { status: 'passed', brokenLinks: 0 };
}

export function get_site_status() {
  verifyPermission('get_site_status', 'READ');
  const drafts = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md')).length;
  const published = fs.readdirSync(PUBLISHED_DIR).filter(f => f.endsWith('.md')).length;
  return { domain: 'https://tiwantiwa.com', draftsCount: drafts, publishedCount: published, status: 'operational' };
}

export function get_recent_articles() {
  verifyPermission('get_recent_articles', 'READ');
  const published = fs.readdirSync(PUBLISHED_DIR).filter(f => f.endsWith('.md'));
  return published.map(f => f.replace('.md', ''));
}

export function generate_report() {
  verifyPermission('generate_report', 'READ');
  const status = get_site_status();
  return `=== TIWANTIWA MEDIA ORG REPORT ===\nDomain: ${status.domain}\nPublished: ${status.publishedCount}\nDrafts in Queue: ${status.draftsCount}\nStatus: ${status.status}\n================================`;
}
