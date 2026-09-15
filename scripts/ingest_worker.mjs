import fs from 'fs';
import path from 'path';

const RSS_URL = "https://techcrunch.com/feed/"; // Or another public RSS/Atom feed
// Since we don't have an external fetcher library installed by default except Node built-ins,
// let's use node's native fetch (Node 18+) to fetch and parse an RSS feed.

async function ingestFeeds() {
  console.log('[*] Starting automated feed ingestion...');
  
  // Example public RSS feeds relevant to tech, business, and Africa
  const feeds = [
    { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' }
  ];

  for (const feed of feeds) {
    try {
      console.log(`[+] Fetching ${feed.name} (${feed.url})...`);
      const res = await fetch(feed.url);
      const xml = await res.text();
      
      // Basic regex extraction of items to avoid heavy external XML parsers
      const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g);
      if (!itemMatches) {
        console.log(`[-] No items found for ${feed.name}`);
        continue;
      }

      console.log(`[+] Found ${itemMatches.length} items in ${feed.name}. Processing top items...`);
      
      // Take top 2 items as raw ingestion sample
      for (let i = 0; i < Math.min(2, itemMatches.length); i++) {
        const item = itemMatches[i];
        const titleMatch = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]>|<title>([\s\S]*?)<\/title>/);
        const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]>|<description>([\s\S]*?)<\/description>/);
        
        const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : 'Untitled Ingested Article';
        const rawDesc = descMatch ? (descMatch[1] || descMatch[2]) : '';
        const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '').trim();

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
        const draftPath = path.join('/home/earth/digital-magazine/content/drafts', `ingested-${slug}.md`);

        const draftContent = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "ingested-${slug}"
author: "Automated Ingestion Engine"
date: "${new Date().toISOString().split('T')[0]}"
categories: ["technology", "business"]
description: "${cleanDesc.slice(0, 160).replace(/"/g, '\\"')}"
draft: true
---

# Ingested Feed Dispatched Summary

**Source**: ${feed.name} (${feed.url})

## Executive Overview
${cleanDesc}

## Editorial Synthesis & Localized Impact
This raw intelligence payload has been captured by the tiwantiwa ingestion engine. As part of our automated media workflow, this draft awaits further AI expansion or direct editorial review by the Editor-in-Chief.
`;

        fs.writeFileSync(draftPath, draftContent);
        console.log(`[+] Staged ingested draft: ingested-${slug}.md`);
      }

    } catch (err) {
      console.error(`[-] Error ingesting ${feed.name}:`, err.message);
    }
  }
  console.log('[*] Automated feed ingestion complete.');
}

ingestFeeds();
